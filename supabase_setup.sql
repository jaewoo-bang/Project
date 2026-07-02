-- 1. 프로필 테이블 생성 (사용자의 선호 장르 정보 및 아이디 찾기용 전화번호 저장)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  phone TEXT,
  preferred_genres TEXT[] DEFAULT '{}'::TEXT[],
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS (Row Level Security) 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. RLS 정책 설정 (사용자는 자신의 프로필만 읽고 수정할 수 있음)
-- 기존 정책이 존재할 경우 삭제 후 재생성하여 충돌을 회피합니다.
DROP POLICY IF EXISTS "사용자는 자신의 프로필을 조회할 수 있습니다." ON public.profiles;
CREATE POLICY "사용자는 자신의 프로필을 조회할 수 있습니다." 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "사용자는 자신의 프로필을 수정할 수 있습니다." ON public.profiles;
CREATE POLICY "사용자는 자신의 프로필을 수정할 수 있습니다." 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- 3. 회원가입 시 자동으로 profiles 테이블에 레코드를 생성하는 함수 및 트리거 정의
-- 가입 시 넘어온 User Metadata(raw_user_meta_data)의 phone 및 preferred_genres 데이터를 읽어와 
-- 데이터베이스 레벨에서 원자적으로 초기값을 삽입합니다. (이메일 미인증에 따른 RLS 업데이트 실패 방지)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, phone, preferred_genres)
  VALUES (
    new.id,
    COALESCE((new.raw_user_meta_data->>'phone'), ''),
    COALESCE(ARRAY(SELECT jsonb_array_elements_text(new.raw_user_meta_data->'preferred_genres')), '{}'::TEXT[])
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거가 이미 존재하는 경우 삭제 후 재생성
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. [보안 회원탈퇴] 현재 로그인된 사용자를 auth.users에서 직접 삭제하는 RPC 함수 정의
CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS VOID AS $$
DECLARE
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION '인증되지 않은 사용자입니다.';
  END IF;
  
  DELETE FROM auth.users WHERE id = current_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. [아이디 찾기] 전화번호를 기반으로 마스킹된 이메일 주소를 찾아주는 RPC 함수 정의
CREATE OR REPLACE FUNCTION public.find_email_by_phone(phone_num TEXT)
RETURNS TEXT AS $$
DECLARE
  found_email TEXT;
BEGIN
  SELECT u.email INTO found_email
  FROM auth.users u
  JOIN public.profiles p ON u.id = p.id
  WHERE p.phone = phone_num
  LIMIT 1;

  IF found_email IS NULL THEN
    RETURN NULL;
  END IF;

  -- 이메일 주소 마스킹 처리 (예: abcd@gmail.com -> ab***@gmail.com)
  RETURN REGEXP_REPLACE(found_email, '^([^@]{2})[^@]+(@.+)$', '\1***\2');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
