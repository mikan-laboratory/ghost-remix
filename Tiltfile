docker_compose('docker-compose.dev.yml')

# Install NPM packages
local_resource(
    name='install-packages',
    cmd='sh -c "if [ ! -d node_modules ]; then npm install; fi"',
    auto_init=True,
)

# Generate Prisma Client
local_resource(
    name='gen-prisma-client',
    cmd='npx prisma generate',
    auto_init=True,
    deps=['./prisma/schema.prisma'],
    resource_deps=['install-packages']
)

# Remix
local_resource(
    name='remix',
    serve_cmd='npm run dev',
    resource_deps=['gen-prisma-client'],
    deps=['./package.json', './package-lock.json']
)

local_resource(
    name='db gui',
    serve_cmd='prisma studio',
    trigger_mode=TRIGGER_MODE_MANUAL,
    auto_init=False,
    resource_deps=['gen-prisma-client']
)

# Seed and Restart
load('ext://uibutton', 'cmd_button')

cmd_button('seed',
  argv=['sh', '-c', 'npm run seed:dev && docker compose -f docker-compose.dev.yml restart ghost'],
  resource='ghost',
  icon_name='downloading',
  text='Seed'
)
