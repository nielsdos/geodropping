export default function Help() {
    return (
        <div className="container">
            <h1>Help</h1>

            <h2>Demo</h2>
            <video
                src="https://user-images.githubusercontent.com/7771979/146984824-ec995352-4b50-4ca9-978b-e4006bf14065.mp4"
                data-canonical-src="https://user-images.githubusercontent.com/7771979/146984824-ec995352-4b50-4ca9-978b-e4006bf14065.mp4"
                controls="controls" muted="muted"/>

            <h2>Recommendations</h2>
            <p>
                <strong>Blue lines</strong> on the map show where panoramas are available.<br />
                <strong>Green lines</strong> show where non-panorama images are available.
            </p>
            <p>It is recommended to try this game in big cities with <strong>panoramas</strong>.</p>

            <h2>Questions</h2>
            <ul>
                <li>
                    <h3>Why no Google Street View?</h3>
                    Google Street View requires a billing account on the Google Cloud Console.
                </li>
            </ul>

            <h2>Known issues</h2>
            <ul>
                <li>
                    Mapillary street-level imagary is not complete. Therefore, it's possible that you can't go through all streets or that the images don't have full panorama. You get the best experience when you play in big cities. I tried mitigating this with the white circle you can click on the street viewer.
                </li>
                <li>
                    Since fbcdn hosts the Mapillary images, blocking requests to Facebook's CDN will also block the street-level imagary, often allowing you to go to places even if there are no arrows, by skipping parts of the street.
                </li>
            </ul>
        </div>
    );
}