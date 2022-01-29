echo "Installing 'node-cmd'"
npm install node-cmd
echo "Installing 'node-ssh'"
npm install node-ssh
git reset -- hard
git pull
echo "Running 'deploy.js'"
node deploy.js