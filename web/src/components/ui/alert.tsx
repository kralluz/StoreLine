type Props = {
  message: string;
};

export function Alert({ message }: Props) {
  if (!message) return null;

  return (
    <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
      {message}
    </p>
  );
}