# Instalar Rust
Invoke-WebRequest -Uri https://win.rustup.rs -OutFile rustup-init.exe
.\rustup-init.exe -y
# Instalar Solana CLI
Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://release.solana.com/stable/install'))
# Instalar Anchor
cargo install --git https://github.com/coral-xyz/anchor --tag v0.27.0 anchor-cli --locked
# Verificar instalaciones
rustc --version
solana --version
anchor --version