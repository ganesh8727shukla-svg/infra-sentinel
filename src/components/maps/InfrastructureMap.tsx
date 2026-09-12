import { useMemo, useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip, useMapEvents } from "react-leaflet";
import { Link } from "@tanstack/react-router";
import type { Asset } from "@/types";
import { LEVEL_HEX, LEVEL_LABEL, riskLevel } from "@/utils/format";
import { MAP_CENTER, MAP_ZOOM } from "@/config";
import { Button } from "@/components/ui/button";

function ZoomWatcher({ onZoom }: { onZoom: (z: number) => void }) {
  const map = useMapEvents({
    zoomend: () => onZoom(map.getZoom()),
  });
  return null;
}

interface Cluster {
  key: string;
  lat: number;
  lng: number;
  count: number;
  worst: number;
}

export default function InfrastructureMap({
  assets,
  height = 480,
  compact = false,
}: {
  assets: Asset[];
  height?: number;
  compact?: boolean;
}) {
  const [zoom, setZoom] = useState(MAP_ZOOM);
  const clustered = zoom < 8;

  const clusters = useMemo<Cluster[]>(() => {
    const map = new Map<string, Cluster>();
    for (const a of assets) {
      const existing = map.get(a.district);
      if (existing) {
        existing.count += 1;
        existing.lat = (existing.lat * (existing.count - 1) + a.latitude) / existing.count;
        existing.lng = (existing.lng * (existing.count - 1) + a.longitude) / existing.count;
        existing.worst = Math.max(existing.worst, a.riskScore);
      } else {
        map.set(a.district, {
          key: a.district,
          lat: a.latitude,
          lng: a.longitude,
          count: 1,
          worst: a.riskScore,
        });
      }
    }
    return [...map.values()];
  }, [assets]);

  return (
    <div className="overflow-hidden rounded-lg border border-border" style={{ height }}>
      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <ZoomWatcher onZoom={setZoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {clustered
          ? clusters.map((c) => (
              <CircleMarker
                key={c.key}
                center={[c.lat, c.lng]}
                radius={10 + Math.min(10, c.count)}
                pathOptions={{
                  color: "#fff",
                  weight: 2,
                  fillColor: LEVEL_HEX[riskLevel(c.worst)],
                  fillOpacity: 0.85,
                }}
              >
                <Tooltip direction="top">
                  {c.key}: {c.count} assets
                </Tooltip>
              </CircleMarker>
            ))
          : assets.map((a) => {
              const level = riskLevel(a.riskScore);
              return (
                <CircleMarker
                  key={a.id}
                  center={[a.latitude, a.longitude]}
                  radius={7}
                  pathOptions={{
                    color: "#fff",
                    weight: 2,
                    fillColor: LEVEL_HEX[level],
                    fillOpacity: 0.95,
                  }}
                >
                  <Tooltip direction="top">
                    {a.assetCode} — {LEVEL_LABEL[level]}
                  </Tooltip>
                  <Popup>
                    <div className="space-y-2 p-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{a.assetCode}</p>
                        <p className="text-xs text-muted-foreground">{a.location}</p>
                      </div>
                      <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                        <dt className="text-muted-foreground">Health</dt>
                        <dd className="text-right font-medium">{a.healthScore} / 100</dd>
                        <dt className="text-muted-foreground">Risk</dt>
                        <dd className="text-right font-medium" style={{ color: LEVEL_HEX[level] }}>
                          {a.riskScore} / 100 · {LEVEL_LABEL[level]}
                        </dd>
                        <dt className="text-muted-foreground">Status</dt>
                        <dd className="text-right font-medium">{a.status}</dd>
                      </dl>
                      {!compact && (
                        <div className="flex gap-2 pt-1">
                          <Button asChild size="sm" className="h-7 px-2 text-xs">
                            <Link to="/admin/assets/$id" params={{ id: a.id }}>
                              View Asset
                            </Link>
                          </Button>
                          <Button asChild size="sm" variant="outline" className="h-7 px-2 text-xs">
                            <Link to="/admin/work-orders">View Work Order</Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
      </MapContainer>
    </div>
  );
}
