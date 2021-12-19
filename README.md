# GeoDropping

A game where you are dropped within X meters from a chosen point and have to navigate in street-level imagary towards the destination as fast as possible. You can generate a challenge URL to share with your friends to see who is the fastest.


https://user-images.githubusercontent.com/7771979/146659683-e10b651a-c75e-40cf-9fb3-3af8bed72c56.mp4


## Background

This game is inspired by GeoGuessr, it's kinda the "reverse" in a way.
The project uses [OpenStreetMap](https://www.openstreetmap.org/) for displaying the map and it uses [Mapillary](https://www.mapillary.com/) for the street-level imagary.

The reason for choosing this instead of Google Maps + Streetview is that Googles API's cost quite some money that I'm not willing to pay for. An alternative is allowing users to generate an API key themselves, but nobody's gonna do that. Therefore I'm using a free alternative service. Even though Mapillary is less complete than Streetview, it's still mostly playable.

## Running and setup

Copy `.env.example` to `.env` and change your Mapillary API key to yours.

`yarn start` runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## License

The code is licensed under the MIT license unless noted otherwise.
The code contains a utility function taken from [Mercantile](https://github.com/mapbox/mercantile/) licensed under [BSD-3](https://github.com/mapbox/mercantile/blob/main/LICENSE.txt).

## TODO

- [ ] Host this
