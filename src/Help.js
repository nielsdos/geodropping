export default function Help() {
    return (
        <div className="container">
            <h1>Help</h1>
            <h2>Recommendations</h2>
            <p>
                <strong>Blue lines</strong> on the map show where panoramas are available.<br />
                <strong>Green lines</strong> show where non-panorama images are available.
            </p>
            <p>It is recommended to try this game in big cities with <strong>panoramas</strong>.</p>

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