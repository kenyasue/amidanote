# Amidanote

Amidanote is nextjs based note app which you can take a note in markdown format as also organize and publish.

## Try SaaS version now

Open https://amidanote.com/ then go to the app

## Start a development server

1. Clone the source code from github

```
git clone https://github.com/kenyasue/amidanote.git
```

2. Install dependencies

```
npm install
```

3. Create config file

```
cp .env_sample .env
```

4. Edit .env

```
nano .env
```

And change following lines to absolute path

```
UPLOADS_PATH=***
BASE_PATH=***
```

5. Start databases server in docler

```
cd docker/
sudo docker-compose up -d
```

6. Start the server

```
npm run dev
```

7. Open http://localhost:3000 in your browser.
