if [ -n "$GITHUB_API_KEY" ]; then
    git clone https://github.com/systelab/systelab.github.io.git
    cp ./dist/* ./systelab.github.io/allure-reporter
    cd systelab.github.io
    git add .
    git -c user.name='travis' -c user.email='travis' commit -m update
    git push -f -q https://systelab:$GITHUB_API_KEY@github.com/systelab/systelab.github.io
  fi
