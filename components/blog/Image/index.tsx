import React, { CSSProperties } from 'react';

interface CustomImageProps {
  alt?: string;
  src?: string;
  title?: string;
}


const CustomImage: React.FC<CustomImageProps> = ({ alt, src, title }) => {
  if (!src) return null;

  // Parse the width, align, and caption from the title
  const widthMatch = title ? title.match(/width=(\d+px|\d+%)/) : null;
  const width = widthMatch ? widthMatch[1] : 'auto';

  const alignMatch = title ? title.match(/align=(left|center|right)/) : null;
  const align = alignMatch ? alignMatch[1] : 'center';
  
  const radiusMatch = title ? title.match(/radius=(\d+\.?\d*)/) : null;
  const radius = radiusMatch ? `${radiusMatch[1]}rem` : '0.6rem';

  const captionMatch = title ? title.match(/caption='([^"]+)'/) : null;
  const caption = captionMatch ? captionMatch[1] : '';
  
  const imgStyleMarginBottom: string = caption ? '0' : '2rem';

  const imgStyle: CSSProperties = {
    maxWidth: '100%',
    height: 'auto',
    width: width,
    display: 'block',
    margin: align === 'left' ? `2rem auto ${imgStyleMarginBottom} 0` : align === 'right' ? `2rem 0 ${imgStyleMarginBottom} auto` : `2rem auto ${imgStyleMarginBottom} auto`,
    borderRadius: radius,
    border: '1px solid hsl(var(--border))',
  };
  const captionStyle: CSSProperties = {
    maxWidth: '100%',
    width: width === 'auto' ? '400px' : width,
    margin: align === 'left' ? '5px auto 2rem 0' : align === 'right' ? '5px 0 2rem auto' : '5px auto 2rem auto',
    // border: '1px solid #ddd',
    textAlign: 'center',
  };

  return (
    <figure>
      <img
        src={src}
        alt={alt || ''}
        style={imgStyle}
      />
      {caption && <figcaption style={captionStyle}>{caption}</figcaption>}
    </figure>
  );
};

export default CustomImage;
