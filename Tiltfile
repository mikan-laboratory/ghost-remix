# Ghost 
docker_compose('docker-compose.dev.yml')

# Remix
local_resource('remix', 'npm i', serve_cmd='npm run dev')
local_resource('db gui', serve_cmd='prisma studio', trigger_mode= TRIGGER_MODE_MANUAL, auto_init=False)
# Seed
load('ext://uibutton', 'cmd_button')
cmd_button('seed', 
  argv=['sh', '-c', 'npm run seed:dev'],
  resource='remix',
  icon_name='downloading',
  text='Seed'
)
