docker_compose('docker-compose.dev.yml')

# Remix
local_resource('remix', 'npm i', serve_cmd='npm run dev')
local_resource('db gui', serve_cmd='prisma studio', trigger_mode= TRIGGER_MODE_MANUAL, auto_init=False)

# Seed and Restart
load('ext://uibutton', 'cmd_button')

cmd_button('seed', 
  argv=['sh', '-c', 'npm run seed:dev && docker-compose -f docker-compose.dev.yml restart ghost'],
  resource='ghost',
  icon_name='downloading',
  text='Seed'
)

cmd_button('copy_theme', 
  argv=['sh', '-c', 'npm run seed:theme && docker-compose -f docker-compose.dev.yml restart ghost'],
  resource='ghost',
  icon_name='copy',
  text='Copy Theme'
)
