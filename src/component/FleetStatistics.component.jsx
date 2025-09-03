import { Grid } from "@mui/material";
import { useMemo } from "react";
import { formatTimestampHourMinute } from "../utils/commom";

const FleetStatistics = ({ statistics }) => {
  const { total, timestamp, average_speed } = statistics;
  const STATISTICS_OPTIONS = useMemo(
    () => [
      {
        title: "Total Fleet",
        count: total,
      },
      {
        title: "Avg Speed",
        count: average_speed,
      },
      {
        title: "Moving",
        count: 1,
      },
      {
        title: "Last Updated",
        count: formatTimestampHourMinute(timestamp),
      },
    ],
    [average_speed, timestamp, total]
  );

  return (
    <div className="fleet-statistics-container">
      <h3>Fleet Statistics</h3>

      <Grid container spacing={2}>
        {STATISTICS_OPTIONS.map(({ title, count }) => {
          return (
            <Grid size={6} key={title}>
              <div className="fleet-statistics-item">
                <h4>{count}</h4>
                <h6>{title}</h6>
              </div>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default FleetStatistics;
