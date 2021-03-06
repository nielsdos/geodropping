# GeoDropping

Play at https://nielsdos.github.io/geodropping

A game where you are dropped within X meters from a chosen point and have to navigate in street-level imagary towards the destination as fast as possible. You can generate a challenge URL to share with your friends to see who is the fastest.


https://user-images.githubusercontent.com/7771979/146984824-ec995352-4b50-4ca9-978b-e4006bf14065.mp4


## Background

This game is inspired by GeoGuessr, it's kinda the "reverse" in a way.
The project uses [OpenStreetMap](https://www.openstreetmap.org/) for displaying the map and it uses [Mapillary](https://www.mapillary.com/) for the street-level imagary.

The reason for choosing this instead of Google Maps + Streetview is that Googles API's cost quite some money that I'm not willing to pay for. An alternative is allowing users to generate an API key themselves, but nobody's gonna do that. Therefore I'm using a free alternative service. Even though Mapillary is less complete than Streetview, it's still mostly playable.

## Known issues

* Mapillary street-level imagary is not complete. Therefore, it's possible that you can't go through all streets or that the images don't have full panorama. You get the best experience when you play in big cities. I tried mitigating this with the white circle you can click on the street viewer.
* Since fbcdn hosts the Mapillary images, blocking requests to Facebook's CDN will also block the street-level imagary, often allowing you to go to places even if there are no arrows, by skipping parts of the street.

## Running and setup

Copy `.env.example` to `.env` and change your Mapillary API key to yours.

`yarn start` runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## License

The code is licensed under the MIT license unless noted otherwise.
The code contains a utility function taken from [Mercantile](https://github.com/mapbox/mercantile/) licensed under [BSD-3](https://github.com/mapbox/mercantile/blob/main/LICENSE.txt).
