const middleware = {}

middleware['route'] = require('../src/middleware/route.ts')
middleware['route'] = middleware['route'].default || middleware['route']

export default middleware
