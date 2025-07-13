let project = {
    name = "blackjack-motoko",
    version = "0.1.0",
    dependencies = {
        "base" = "https://github.com/dfinity/motoko-base.git",
        "mo:base" = "https://github.com/dfinity/motoko-base.git",
    },
    source = {
        "src/blackjack_backend/main.mo",
        "src/blackjack_frontend/src/index.js",
        "src/blackjack_frontend/src/index.css",
        "src/blackjack_frontend/src/index.html",
    },
    assets = {
        "src/blackjack_frontend/assets/sample-asset.txt",
    },
    packageSet = "https://github.com/dfinity/vessel-package-set.git",
};