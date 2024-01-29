docker_compose('docker-compose.dev.yml')

local_resource(
    name='prisma-generate',
    cmd='npx prisma generate',
    auto_init=True,
    deps=['./prisma/schema.prisma']
)

# Remix
local_resource(
    name='remix',
    cmd='npm i',
    serve_cmd='npm run dev',
    resource_deps=['prisma-generate']
)

local_resource(
    name='db gui',
    serve_cmd='prisma studio',
    trigger_mode=TRIGGER_MODE_MANUAL,
    auto_init=False,
    resource_deps=['prisma-generate']
)

# Seed and Restart
load('ext://uibutton', 'cmd_button')

cmd_button('seed', 
  argv=['sh', '-c', 'npm run seed:dev && docker-compose -f docker-compose.dev.yml restart ghost'],
  resource='ghost',
  icon_name='downloading',
  text='Seed'
)
