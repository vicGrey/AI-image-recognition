import { Loader2, Sparkles } from "lucide-react";

interface AnalyzeButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

const AnalyzeButton = ({ onClick, disabled, loading }: AnalyzeButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex w-full items-center justify-center gap-2 rounded-lg gradient-bg px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
  >
    {loading ? (
      <>
        <Loader2 className="h-4 w-4 animate-spin-slow" />
        Analyzing…
      </>
    ) : (
      <>
        <Sparkles className="h-4 w-4" />
        Analyze Image
      </>
    )}
  </button>
);

export default AnalyzeButton;
