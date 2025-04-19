interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  fill?: boolean;
}

export default function Image(props: Props) {
  const { fill, ...rest } = props;

  if (fill) {
    return (
      <img
        {...rest}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          ...rest.style,
        }}
      />
    );
  }

  return <img {...rest} />;
}
