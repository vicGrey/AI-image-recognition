interface Label {
  Name: string;
  Confidence: number;
}

interface ResultsListProps {
  labels: Label[];
}

const ResultsList = ({ labels }: ResultsListProps) => {
  if (labels.length === 0) return null;

  return (
    <div className="animate-fade-in-up space-y-2">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Detected Objects
      </h2>
      <ul className="space-y-1.5">
        {labels.map((label, i) => {
          const pct = label.Confidence;
          return (
            <li
              key={i}
              className="animate-fade-in-up flex items-center justify-between rounded-md bg-muted/60 px-4 py-2.5"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="text-sm font-medium text-foreground">{label.Name}</span>
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full gradient-bg transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="min-w-[3.5rem] text-right text-xs font-mono text-muted-foreground">
                  {pct.toFixed(1)}%
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ResultsList;
