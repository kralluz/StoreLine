type Props = {
  message: string;
};

export function Alert({ message }: Props) {
  if (!message) return null;

  return <p className="text-red-600">{message}</p>;
}