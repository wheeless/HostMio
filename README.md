
![Logo](https://wheeless.dev/images/AVERNIX.png)


# HostMio by Avernix Technologies

HostMio is a simple yet robust link shortener api. Meant for open source projects to easily integrate into their own system.

[![Build Status](https://app.travis-ci.com/wheeless/HostMio.svg?branch=main)](https://app.travis-ci.com/wheeless/HostMio)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/wheeless/HostMio)
![GitHub](https://img.shields.io/github/license/wheeless/HostMio)
![Maintenance](https://img.shields.io/maintenance/yes/2022)



## Authors

- [@wheeless](https://www.github.com/wheeless)


## API Reference

#### Get all links

```http
  GET /api/v1/links
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Redirect to longUrl

```http
  GET /api/v1/links/${shortUrl}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `shortUrl`      | `string` | **Required**. Short url redirects to longUrl |

#### Post new shortened link

```http
  POST /api/v1/links/
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `shortUrl`      | `string` | **Optional**. Short url slug that will be at the end of domain. i.e `myDiscord` |
| `longUrl`      | `string` | **Required**. Long url that will be redirected to. i.e `https://discord.com` |


## Documentation

[Documentation](https://api.hostmonkey.io/documentation.html)


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NODE_ENV`

`MONGO_URI`

`ALLOWED_ORIGINS`

`PORT`

`TREBLLE_APIKEY`
`TREBLLE_PROJECTID`

## Feedback

If you have any feedback, please reach out to us at kyle@avernix.com


## Used By

This project is used by the following companies:

- Avernix Technologies
- Hostmonkey.io

