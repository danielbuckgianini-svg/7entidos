#!/usr/bin/env bash
# =====================================================================
#  7entidos - cria a CHAVE DE ENVIO e gera o app assinado (.aab)
#  Rodar no GitHub Codespaces:   bash android-twa/assinar-no-codespaces.sh
#
#  - A senha e digitada so aqui no terminal. Ela NAO aparece na tela,
#    NAO e gravada em arquivo e NAO vai para o git.
#  - Se a chave ja existir (proximas atualizacoes do app), ela e reaproveitada.
#  - Resultado na pasta  para-baixar/  (protegida pelo .gitignore).
# =====================================================================
set -euo pipefail

RAIZ="$(cd "$(dirname "$0")/.." && pwd)"
PROJETO="$RAIZ/android-twa"
SAIDA="$RAIZ/para-baixar"
CHAVE="$SAIDA/7entidos-chave-de-envio.keystore"
APELIDO="7entidos"
SDK="${ANDROID_HOME:-$HOME/android-sdk}"

passo() { echo; echo "==> $*"; }

# --- 0. Seguranca: a pasta de saida nunca pode ir para o git -----------
cd "$RAIZ"
if ! git check-ignore -q "para-baixar/teste.keystore"; then
  echo "ERRO: a pasta para-baixar/ nao esta protegida no .gitignore. Parei por seguranca."; exit 1
fi
mkdir -p "$SAIDA"

# --- 1. Java -------------------------------------------------------------
passo "1/6 Conferindo o Java"
if ! command -v keytool >/dev/null || ! java -version 2>&1 | grep -qE 'version "(17|2[0-9])'; then
  sudo apt-get update -qq && sudo apt-get install -y -qq openjdk-21-jdk-headless >/dev/null
fi
java -version 2>&1 | head -1

# --- 2. Kit do Android (SDK) ---------------------------------------------
passo "2/6 Preparando o kit do Android (so na primeira vez, alguns minutos)"
if [ ! -x "$SDK/cmdline-tools/latest/bin/sdkmanager" ]; then
  mkdir -p "$SDK/cmdline-tools"
  curl -sSL -o /tmp/clt.zip https://dl.google.com/android/repository/commandlinetools-linux-13114758_latest.zip
  unzip -q -o /tmp/clt.zip -d "$SDK/cmdline-tools"
  rm -rf "$SDK/cmdline-tools/latest"; mv "$SDK/cmdline-tools/cmdline-tools" "$SDK/cmdline-tools/latest"
fi
export ANDROID_HOME="$SDK"
yes | "$SDK/cmdline-tools/latest/bin/sdkmanager" --licenses >/dev/null 2>&1 || true
"$SDK/cmdline-tools/latest/bin/sdkmanager" "platforms;android-36" "build-tools;36.0.0" >/dev/null

# --- 3. Monta o app -------------------------------------------------------
passo "3/6 Montando o app (versao em android-twa/app/build.gradle)"
cd "$PROJETO"
chmod +x gradlew
./gradlew bundleRelease --no-daemon -q
AAB_SEM_ASSINATURA="$PROJETO/app/build/outputs/bundle/release/app-release.aab"
cp "$AAB_SEM_ASSINATURA" "$SAIDA/app-release.aab"

# --- 4. Senha + chave -----------------------------------------------------
passo "4/6 Senha da chave de envio"
echo "    Ao digitar, NADA aparece na tela. Isso e normal. Aperte Enter no final."
if [ -f "$CHAVE" ]; then
  echo "    A chave ja existe. Digite a senha dela."
  read -r -s -p "    Senha: " SENHA_7E; echo
else
  while true; do
    read -r -s -p "    Crie a senha (minimo 8 caracteres): " SENHA_7E; echo
    read -r -s -p "    Digite a mesma senha de novo:        " SENHA_7E_2; echo
    if [ "${#SENHA_7E}" -lt 8 ]; then echo "    Muito curta. Tente de novo."; continue; fi
    if [ "$SENHA_7E" != "$SENHA_7E_2" ]; then echo "    As duas nao sao iguais. Tente de novo."; continue; fi
    break
  done
  unset SENHA_7E_2
fi
export SENHA_7E
trap 'unset SENHA_7E' EXIT

if [ ! -f "$CHAVE" ]; then
  passo "Criando a chave de envio"
  keytool -genkeypair -v -keystore "$CHAVE" -storetype PKCS12 -alias "$APELIDO" \
    -keyalg RSA -keysize 2048 -validity 10000 \
    -dname "CN=7entidos, O=DBGIANINI Marketing, L=Santos, ST=SP, C=BR" \
    -storepass:env SENHA_7E -keypass:env SENHA_7E >/dev/null 2>&1
fi

# --- 5. Assina e confere --------------------------------------------------
passo "5/6 Assinando o app"
jarsigner -keystore "$CHAVE" -storepass:env SENHA_7E -keypass:env SENHA_7E \
  -sigalg SHA256withRSA -digestalg SHA-256 "$SAIDA/app-release.aab" "$APELIDO" >/dev/null
jarsigner -verify "$SAIDA/app-release.aab" | grep -q "jar verified" \
  && echo "    Assinatura conferida: OK" || { echo "    ERRO na assinatura"; exit 1; }

BT="$(find "$HOME/.gradle/caches/modules-2" -name 'bundletool-*.jar' | head -1)"
if [ -n "$BT" ]; then
  CP="$(find "$HOME/.gradle/caches/modules-2" -name '*.jar' | tr '\n' ':')"
  MAN="$(java -cp "$CP" com.android.tools.build.bundletool.BundleToolMain dump manifest --bundle="$SAIDA/app-release.aab" 2>/dev/null)"
  if echo "$MAN" | grep -q "AD_ID"; then echo "    ATENCAO: AD_ID apareceu no app!"; else echo "    Permissao AD_ID: nao aparece (OK)"; fi
  echo "$MAN" | grep -o 'android:targetSdkVersion="[0-9]*"\|android:versionCode="[0-9]*"\|android:versionName="[^"]*"' | sed 's/^/    /'
fi

# --- 6. SHA-256 -------------------------------------------------------------
passo "6/6 Impressao digital (SHA-256) da chave de envio"
SHA="$(keytool -list -v -keystore "$CHAVE" -alias "$APELIDO" -storepass:env SENHA_7E | grep -m1 'SHA256:' | sed 's/.*SHA256: //')"
echo "$SHA" > "$SAIDA/sha256-da-chave-de-envio.txt"
unset SENHA_7E

echo
echo "=================================================================="
echo " PRONTO!"
echo " SHA-256 (pode mandar no chat, nao e segredo):"
echo "   $SHA"
echo
echo " Na lista de arquivos a esquerda, abra a pasta 'para-baixar' e baixe:"
echo "   - 7entidos-chave-de-envio.keystore  (GUARDE: pen drive + nuvem privada)"
echo "   - app-release.aab                   (o app para a Google Play)"
echo " Clique com o botao direito em cada um > Download."
echo "=================================================================="
