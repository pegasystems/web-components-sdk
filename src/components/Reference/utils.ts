/**
 * Resolve the context when using pagelist OR pagegroup that may contain brackets
 * @param context string contains full path of view context
 * @returns resloved context
 */
export default function resolveContext(context: string | null | undefined): string | null {
  if (!context) {
    return null;
  }
  const regex = /\((\d+)\)/g;
  context = context.replace(regex, (_match, number) => {
    const index = parseInt(number, 10) - 1;
    return `[${index}]`;
  });
  return context;
}
