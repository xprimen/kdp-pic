import { Html5QrcodeScanner } from "html5-qrcode";
import React, { useMemo } from "react";

type Props = {
  setValue: React.Dispatch<React.SetStateAction<string>>;
};

const QRCodeScanner = ({ setValue }: Props) => {
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: {
          width: 250,
          height: 250,
        },
      },
      false
    );
    const success = (result: any) => {
      scanner.clear();
      setValue(result);
      //    console.log("result", result);
    };
    const error = (err: any) => {
      setError(err);
      //    console.log("error", err);
    };

    scanner.render(success, error);

    return () => {
      scanner.clear();
    };
  }, [setValue]);

  return <div id="reader"></div>;
};

export default QRCodeScanner;
