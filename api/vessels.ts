import vessels from "../data/vessels.json";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const west = Number(searchParams.get("west"));
    const south = Number(searchParams.get("south"));
    const east = Number(searchParams.get("east"));
    const north = Number(searchParams.get("north"));

    if ([west, south, east, north].some(Number.isNaN)) {
      return new Response(
        JSON.stringify({
          error: "Invalid bounds",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const filtered = vessels.filter((vessel) => {
      const inLatitude = vessel.lat >= south && vessel.lat <= north;

      let inLongitude = false;

      // handle international date line
      if (west <= east) {
        inLongitude = vessel.lon >= west && vessel.lon <= east;
      } else {
        inLongitude = vessel.lon >= west || vessel.lon <= east;
      }

      return inLatitude && inLongitude;
    });

    return new Response(JSON.stringify(filtered.slice(0, 500)), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=5, stale-while-revalidate=30",
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: err.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
