import React, { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import PropTypes from "prop-types";

// Custom
import PrintPageTableWrapper from "components/printPageTableWrapper";

const PrintModal = forwardRef(({ bookData }, ref) => {
  const componentRef = useRef(null);

  const printComponent = useCallback(() => {
    componentRef?.current && componentRef.current.print();
  }, [componentRef.current])
  useImperativeHandle(ref, () => ({
    print: () => {
      printComponent();
    }
  }));
  return (
    <div className="print-view">
      <PrintPageTableWrapper
        ref={componentRef}
        size="A4 portrait"
      // filename={`${t("bookings_key")}-${bookData.bookingNumber}`}
      >
        <div dangerouslySetInnerHTML={{ __html: bookData }} />
      </PrintPageTableWrapper>

    </div>
  )
});
PrintModal.propTypes = {
  bookData: PropTypes.object, // You can adjust the shape of the object as needed
};

PrintModal.displayName = "PrintModal";
export default PrintModal;

