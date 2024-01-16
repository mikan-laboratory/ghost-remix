# Ghost 
docker_compose('docker-compose.dev.yml')

# Remix
local_resource('remix', 'npm i', serve_cmd='npm run dev')

# Seed
load('ext://uibutton', 'cmd_button')
cmd_button('seed', 
  argv=['sh', '-c', 'npm run seed:dev'],
  resource='remix',
  icon_name='downloading',
  text='Seed'
)
