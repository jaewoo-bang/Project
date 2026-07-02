$movies = @{
    "1" = "https://image.tmdb.org/t/p/w500/qJ2tWGBbeZ86QI7m13w3nQ752lA.jpg"
    "2" = "https://image.tmdb.org/t/p/w500/8tZYtuWezp8n7Ycs41K2ic4uEVm.jpg"
    "3" = "https://image.tmdb.org/t/p/w500/uC6TTUhfUEswld2076CNzbKnA66.jpg"
    "4" = "https://image.tmdb.org/t/p/w500/i670A5V9VlZq14rV4B5z2t7b62b.jpg"
    "5" = "https://image.tmdb.org/t/p/w500/i9nO0rXpZJ4PzR453X7pZly2k5C.jpg"
    "6" = "https://image.tmdb.org/t/p/w500/j2Nl1l24Dk7oYv1sU3S7Y4SgT92.jpg"
    "7" = "https://image.tmdb.org/t/p/w500/gEU2Qv4zcyx3vcgswm2ux54N7mD.jpg"
    "8" = "https://image.tmdb.org/t/p/w500/lh4aVh0vZW1iVUGkg2V46tFLGvF.jpg"
    "9" = "https://image.tmdb.org/t/p/w500/wD6jY6zV99o250pUnR3H4U0yK2J.jpg"
    "10" = "https://image.tmdb.org/t/p/w500/jg8S1l0SkhgD0X6c46l2w9p9d5.jpg"
    "11" = "https://image.tmdb.org/t/p/w500/kyeqWzo2vQUgik1CYvi2O2Y2S6Z.jpg"
    "12" = "https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hUIBrzyGWK3cj.jpg"
    "13" = "https://image.tmdb.org/t/p/w500/lR4KK04UgyC5w772fhBmeFS344g.jpg"
    "14" = "https://image.tmdb.org/t/p/w500/RYMX2wc7H6Yv4607ohtIB8604J.jpg"
    "15" = "https://image.tmdb.org/t/p/w500/kve20tHw2nZbhikJU8ve46II7qb.jpg"
}

$music = @{
    "101" = "https://i.scdn.co/image/ab67616d0000b273e2e352ca913fb0164c48972e"
    "102" = "https://i.scdn.co/image/ab67616d0000b273c5b10787e9cfce6f4e1f7249"
    "103" = "https://i.scdn.co/image/ab67616d0000b273ce2ee9b69b9175390772594a"
    "104" = "https://i.scdn.co/image/ab67616d0000b273c15eb341d3ee5cf754d92ee9"
    "105" = "https://i.scdn.co/image/ab67616d0000b273d6b1d4201387d3d1f1f2385b"
    "106" = "https://i.scdn.co/image/ab67616d0000b273b400994191d904b78fa5d95d"
    "107" = "https://i.scdn.co/image/ab67616d0000b273cb621124619d08ba2d973719"
    "108" = "https://i.scdn.co/image/ab67616d0000b2731c3c9b7449bdf54fa169f468"
    "109" = "https://i.scdn.co/image/ab67616d0000b273297a7a5a8f4c2ff8816c7cf6"
    "110" = "https://i.scdn.co/image/ab67616d0000b273b2dd09171b3e8111976a4df6"
    "111" = "https://i.scdn.co/image/ab67616d0000b273574c89df96756627038e2197"
    "112" = "https://i.scdn.co/image/ab67616d0000b2739d28fd01859033a556dd7e68"
    "113" = "https://i.scdn.co/image/ab67616d0000b2735bfe2a188448ebf5c88b8bb8"
    "114" = "https://i.scdn.co/image/ab67616d0000b273b06fb7a7f45c92cde8626639"
    "115" = "https://i.scdn.co/image/ab67616d0000b27393437bbd6c5c6cfb48981df5"
}

if (-not (Test-Path "assets/movies")) { New-Item -ItemType Directory -Path "assets/movies" | Out-Null }
if (-not (Test-Path "assets/music")) { New-Item -ItemType Directory -Path "assets/music" | Out-Null }

Write-Host "Downloading movies using curl.exe..."
foreach ($key in $movies.Keys) {
    $url = $movies[$key]
    $dest = "assets/movies/$key.jpg"
    curl.exe -L -A "Mozilla/5.0" -o $dest $url
}

Write-Host "Downloading music using curl.exe..."
foreach ($key in $music.Keys) {
    $url = $music[$key]
    $dest = "assets/music/$key.jpg"
    curl.exe -L -A "Mozilla/5.0" -o $dest $url
}

Write-Host "All assets downloaded successfully!"
