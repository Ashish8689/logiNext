import { useMemo } from "react";

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
        count: timestamp,
      },
    ],
    [average_speed, timestamp, total]
  );

  return (
    <div className="fleet-statistics-container">
      {STATISTICS_OPTIONS.map((item) => {
        return (
          <div className="fleet-statistics-item">
            <h6>{item.count}</h6>
            <h4>{item.title}</h4>
          </div>
        );
      })}
    </div>
  );
};

export default FleetStatistics;
