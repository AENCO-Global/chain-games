from fabric.api import *
from datetime  import datetime

env.user = 'deploy'
dep_directory = '/opt/www/games.chaatz.com'

def uptime():
    run("uptime")

def develop():
  env.hosts = ['dev-ap-games.chaatz.com']
  env.purpose = 'dev'
  env.dns = ['dev-ap-games']
  env.ver=datetime.now().strftime("%Y-%m-%d")+'-dev-'

def staging():
  env.hosts = ['chaatz-live-staging']
  env.purpose = 'sta'
  env.dns = 'https://staging-games.chaatz.com/games/index.html'
  env.ver=datetime.now().strftime("%Y-%m-%d")+'-sta-'

def prod():
  env.hosts = ['chaatz-live-production']
  env.purpose = 'prod'
  env.dns = ['https://games.chaatz.com/games/index.html']
  env.ver=datetime.now().strftime("%Y-%m-%d")+'-pro-'

def s3deploy(build):
  print("--------------- Deploying s3 version: %s to: %s --------------------------" % (build, env.host_string))
  local('echo %s > ./version.info' % (env.ver+build) )
  local('echo "var txtversion = \'%s\'" > ./battleship/version.js' % (env.ver+build) )
  local('echo "var txtversion = \'%s\'" > ./connect4/version.js' % (env.ver+build) )
  local('echo "var txtversion = \'%s\'" > ./connect5/version.js' % (env.ver+build) )
  local('echo "var txtversion = \'%s\'" > ./chess/version.js' % (env.ver+build) )
  ##Minify the Code
  local('./minify.sh')

  ## Change local files before deploy
  local('sudo s3fs %s /mnt/%s/ -o allow_other,del_cache,umask=000,nonempty,url=https://s3-ap-southeast-1.amazonaws.com' % (env.host_string,env.host_string) )
  local('rsync -rv --exclude .git --exclude fabfile.py . /mnt/%s/games' % (env.host_string) )
  local('sudo umount /mnt/%s' % (env.host_string) )
  print("--------------- Deployment complete: %s to: %s --------------------------" % (build, env.host_string))
  print(" To Test the DNS is as follows: %s to: %s --------------------------" % (build, env.host_string))

  ## Force push the s3 Files for cache update, then update the time stamp on each entry.
  if "sta" == env.purpose: ## Only do node stuff on dev.
    local("ssh -tq deploy@staging-www.chaatz.com 'sudo /etc/cron.hourly/0staging-games-deploy'")
    local('curl -X PUT -H "Cache-Control: no-cache" -d \'{"name": "4 In A Row" }\' "http://staging-cherry-1.chaatz.com:8085/v1/games/0be741b0-bad4-4300-a613-6660935c16a7"')
    local('curl -X PUT -H "Cache-Control: no-cache" -d \'{"name": "Chess"}\' "http://staging-cherry-1.chaatz.com:8085/v1/games/8e2013f2-6b6b-4db1-9b40-53ba60f5b80f"')

  if "prod" == env.purpose: ## Only do node stuff on dev.
    local("ssh -tq deploy@prod-www.chaatz.com 'sudo /etc/cron.hourly/0prod-games-deploy'")
    local('curl -X PUT -H "Cache-Control: no-cache" -d \'{"name": "4 In A Row" }\' "http://cherry-1.chaatz.com:8085/v1/games/993339fa-ec4f-4c88-a63e-baa562f87c1d"')
    local('curl -X PUT -H "Cache-Control: no-cache" -d \'{"name": "Chess"}\' "http://cherry-1.chaatz.com:8085/v1/games/9833fd25-0b12-4793-ac4b-47c540e9b6ec"')

def devdeploy(build):
  print("---------------------- Deploying to: %s--------------------------------" % (env.host_string))
  local('echo %s > ./version.info' % (env.ver+build) )

  ## Connect 4change settings to the currently deployed server
  local("sed -i 's/dev-ap-games/%s/g' ./connect4/js/env.js" %(env.dns) ); # Config change for tower game

  run('sudo chmod 777 /opt')
  run('sudo mkdir -p /opt/www/')
  run('sudo chown -R deploy:deploy /opt/www')

  local('rsync -vrltOD ./ %s@%s:%s/' % (env.user, env.host_string, dep_directory))

  run('sudo ln -sf /opt/www/games.chaatz.com /var/www/html')
  run('sudo chmod -R 755 %s' % (dep_directory), shell=False)

  ## Restart apache
  run('sudo apachectl restart', shell=False)


def deployServer():
    with cd('/opt/www/games.chaatz.com'):
      # Deploy Server with tower, Server is node and needs modules, so we check and install at the game root. call the main scripts from root.
      print("*************** Working Location *******************")
      run('pwd')
      if "dev" == env.purpose: ## Only do node stuff on dev.
        print("************* Installing NPM packs *****************")
        run('npm install')  # Ensure that the packages.json file is in the root folder. this should create the node_modules folder
        print("************** Installing Forever ******************")
        run('sudo npm install forever -g', shell=False)
        with settings(warn_only=True):
          print("************** Stop tower service ******************")
          run('sudo forever stop tower/server/main.js', shell=False) # start the server for tower.
        print("************** Start tower service *****************")
        run('sudo forever start tower/server/main.js', shell=False) # start the server for tower.
        ## change settings to the currently deployed server
        run("sed -i 's/localhost/%s/g' ./tower/js/config.js" %(env.hosts[0]) ); # Config change for tower game

      print("---------------------------------------------------")
      print("to test http://dev-ap-games.chaatz.com:8001")
      print("        http://dev-ap-games.chaatz.com/tower")
      print("-------------------- Finished ---------------------")