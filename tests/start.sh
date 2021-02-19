#/bin/bash

export NODE_ENV=test 
export DATABASE_URL=mysql://root:testtest@localhost:3307/dbtest
npx prisma migrate dev --name init --preview-feature 

export TS_NODE_COMPILER_OPTIONS='{"module": "commonjs" , "noUnusedLocals": false}' 
mocha -r ts-node/register 'tests/**/*.ts' 