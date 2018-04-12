if [ -n "$GITHUB_API_KEY" ]; then
    cd "$TRAVIS_BUILD_DIR"
    git clone https://github.com/systelab/systelab.github.io.git
    cp ./dist ./systelab.github.io/allure-reporter
    cd systelab.github.io
    git add .
    git -c user.name='travis' -c user.email='travis' commit -m update
    # Make sure to make the output quiet, or else the API token will leak!
    # This works because the API key can replace your password.
    git push -f -q https://systelab:$GITHUB_API_KEY@github.com/systelab/systelab.github.io &2>/dev/null
  fi
