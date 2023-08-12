import React, { useState, useEffect, useRef, createRef } from "react";
import { Link } from "react-router-dom";
import { useScreenshot } from "use-react-screenshot";
import "./config.css";
//icons
import cylinderIcon from "../../icons/doppelzylinder.png";
import cylinderHeadIcon from "../../icons/zylinderlaenge.png";
import icon_plus from "../../icons/icon_plus_1.png";
import icon_minus from "../../icons/icon_minus_1.png";
import iconkey from "../../icons/key.png";
import setting from "../../icons/setting.png";
import up from "../../icons/uparrow.png";
import down from "../../icons/down.png";
import deleted from "../../icons/delete.png";
import reset from "../../icons/reset.png";

const CylinderTypeOptions = [
  "double cylinder",
  "knob cylinder",
  "half cylinder",
  "padlock",
  "camlock cylinder",
  "rim cylinder",
];
const initialCheckboxData = Array.from({ length: 10 }).map(() =>
  Array.from({ length: 5 }).fill(false)
);

const initialTableData = Array.from({ length: 10 }).map((_, index) => ({
  doorDesignation: `Dveře ${index + 1}`,
  cylinderType: "double cylinder",
  cylinderOutsideLength: "30",
  cylinderInsideLength: "30",
  pc: 1,
  keys: [{ name: `Klíč 1`, checked: false }],
}));

const Config = () => {
  const [tableData, setTableData] = useState(initialTableData);
  const [selectedRowCount, setSelectedRowCount] = useState(10); // Initialize with 10 rows

  const ref = createRef(null); //reference for screenshot
  // const { takeScreenshot } = useScreenshot();

  const imageRefs = useRef([]);
  const [checkboxData, setCheckboxData] = useState(initialCheckboxData);
  console.log(checkboxData);

  const [, setIsDropdownOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [dialoguePosition, setDialoguePosition] = useState({ top: 0, left: 0 });
  const handleMouseEnter = (index) => {
    setActiveImageIndex(index);
    const imageRect = imageRefs.current[index].getBoundingClientRect();
    setDialoguePosition({
      position: "absolute",
      top: imageRect.top,
      left: imageRect.right - 700,
    }); // Adjust the left position as needed
  };

  const handleMouseLeave = () => {
    setActiveImageIndex(null);
  };

  const handleInsertBefore = (index) => {
    if (index !== null) {
      setTableData((prevData) => {
        const newRow = {
          doorDesignation: `Dveře ${prevData.length + 1}`, // You can update this based on your requirement
          cylinderType: "double cylinder",
          cylinderOutsideLength: "30",
          cylinderInsideLength: "30",
          pc: 1,
          keys: [{ name: `Klíč 1`, checked: false }],
        };

        const newData = [...prevData];
        newData.splice(index, 0, newRow); // Insert the new row before the selected row

        return newData;
      });
    }
  };

  const [numberOfKeys, setNumberOfKeys] = useState(5);
  const [headerStates, setHeaderStates] = useState(
    [...Array(numberOfKeys)].map(() => ({
      inputFieldValue: "",
      myFieldValue: 1,
    }))
  );

  //SCREENSHOT THINGY

  // const captureAndNavigate = async () => {
  //   try {
  //     const screenshot = await takeScreenshot(ref.current);
  //     // Navigate to the second page with the screenshot data as a parameter
  //     navigate("/fourm", { state: { screenshotData: screenshot } });
  //   } catch (error) {
  //     console.error("Error capturing screenshot:", error);
  //   }
  // };
  //original
  const [, takeScreenshot] = useScreenshot({
    type: "image/jpeg",
    quality: 0.98,
  });

  // const download = (image, { name = "img", extension = "jpg" } = {}) => {
  //   const a = document.createElement("a");
  //   a.href = image;
  //   a.download = createFileName(extension, name);
  //   a.click();
  // };
  // const downloadScreenshot = () => {
  //   takeScreenshot(ref.current).then(download);
  // };

  //modified
  const captureScreenshotAndStore = async () => {
    try {
      const screenshotImage = await takeScreenshot(ref.current);

      // Store the screenshot in localStorage
      localStorage.setItem("screenshotImage", screenshotImage);
    } catch (error) {
      console.error("Error capturing screenshot:", error);
    }
  };

  useEffect(() => {
    // Update the headerStates whenever numberOfKeys changes
    if (numberOfKeys > headerStates.length) {
      const diff = numberOfKeys - headerStates.length;
      const newColumns = Array.from({ length: diff }, () => ({
        inputFieldValue: "",
        myFieldValue: 1,
      }));
      setHeaderStates((prevHeaderStates) => [
        ...prevHeaderStates,
        ...newColumns,
      ]);
    } else if (numberOfKeys < headerStates.length) {
      setHeaderStates((prevHeaderStates) =>
        prevHeaderStates.slice(0, numberOfKeys)
      );
    }
  }, [headerStates.length, numberOfKeys]);

  const handleKeyAdd = () => {
    setNumberOfKeys((prevNumberOfKeys) => prevNumberOfKeys + 1);

    setCheckboxData((prevData) => {
      const newData = prevData.map((row) => [...row, false]); // Add a new checkbox for each row
      return newData;
    });
  };

  const handleKeyMinus = () => {
    setNumberOfKeys((prevNumberOfKeys) => {
      const newNumberOfKeys = Math.max(prevNumberOfKeys - 1, 1);

      // Update the headerStates whenever numberOfKeys changes
      if (newNumberOfKeys < headerStates.length) {
        setHeaderStates((prevHeaderStates) =>
          prevHeaderStates.slice(0, newNumberOfKeys)
        );

        // Update the checkboxData state to remove the last checkbox for each row
        setCheckboxData((prevData) => {
          const newData = prevData.map((row) => row.slice(0, newNumberOfKeys));
          return newData;
        });
      }

      return newNumberOfKeys;
    });
  };

  const handleInput = (index, fieldName, value) => {
    setHeaderStates((prevHeaderStates) => {
      const updatedHeaderStates = prevHeaderStates.map((headerState, idx) => {
        if (index === idx) {
          return { ...headerState, [fieldName]: value };
        }
        return headerState;
      });

      return updatedHeaderStates;
    });
  };

  const handleAdd = (index) => {
    setHeaderStates((prevHeaderStates) => {
      const updatedHeaderStates = prevHeaderStates.map((headerState, idx) => {
        if (index === idx) {
          return { ...headerState, myFieldValue: headerState.myFieldValue + 1 };
        }
        return headerState;
      });

      return updatedHeaderStates;
    });
  };

  const handleRemove = (index) => {
    setHeaderStates((prevHeaderStates) => {
      const updatedHeaderStates = prevHeaderStates.map((headerState, idx) => {
        if (index === idx) {
          return {
            ...headerState,
            myFieldValue: Math.max(headerState.myFieldValue - 1, 1),
          };
        }
        return headerState;
      });

      return updatedHeaderStates;
    });
  };
  const handleInsertAfter = (index) => {
    if (index !== null) {
      setTableData((prevData) => {
        const newRow = {
          doorDesignation: `Dveře ${prevData.length + 1}`, // You can update this based on your requirement
          cylinderType: "double cylinder",
          cylinderOutsideLength: "30",
          cylinderInsideLength: "30",
          pc: 1,
          keys: [{ name: `Klíč 1`, checked: false }],
        };

        const newData = [...prevData];
        newData.splice(index + 1, 0, newRow); // Insert the new row after the selected row

        return newData;
      });
    }
  };
  const handleCheckboxChange = (rowIndex, colIndex) => {
    setCheckboxData((prevData) => {
      const newData = prevData.map((row, i) => {
        if (i === rowIndex) {
          return row.map((checked, j) => (j === colIndex ? !checked : checked));
        } else {
          return [...row];
        } // Copy the entire row array
      });

      console.log(newData); // <-- Move the console.log here
      localStorage.setItem("newData", JSON.stringify(newData));
      return newData;
    });
  };
  const handleDelete = (index) => {
    if (index !== null) {
      setTableData((prevData) => {
        const newData = prevData.filter((_, i) => i !== index); // Remove the row with the selected index

        return newData;
      });
    }
  };
  const handleAddRow = () => {
    setTableData((prevData) => {
      const newRow = {
        doorDesignation: `Dveře ${prevData.length + 1}`,
        cylinderType: "double cylinder",
        cylinderOutsideLength: "30",
        cylinderInsideLength: "30",
        pc: 1,
        keys: [{ name: `Klíč 1`, checked: false }],
      };

      // Update the checkboxData state to include the new row's checkboxes
      console.log("previous");
      console.log(checkboxData);
      const newCheckboxRow = Array(numberOfKeys).fill(false);
      const newCheckboxData = [...checkboxData, newCheckboxRow];

      // Update the checkboxData state
      setCheckboxData(newCheckboxData);
      console.log(checkboxData);
      return [...prevData, newRow];
    });
  };

  const handleRemoveRow = () => {
    setTableData((prevData) => prevData.slice(0, prevData.length - 1));
  };

  const handleRowCountChange = (e) => {
    const rowCount = parseInt(e.target.value, 10);
    setSelectedRowCount(rowCount);
    setTableData((prevData) => {
      if (rowCount > prevData.length) {
        // Add rows
        const diff = rowCount - prevData.length;
        const newRows = Array.from({ length: diff }).map((_, index) => ({
          doorDesignation: `Dveře ${prevData.length + index + 1}`,
          cylinderType: "double cylinder",
          cylinderOutsideLength: "30",
          cylinderInsideLength: "30",
          pc: 1,
          keys: [{ name: `Klíč 1`, checked: false }],
        }));

        // Update the checkboxData state to include the new rows' checkboxes
        const newCheckboxRows = Array.from({ length: diff }, () =>
          Array(headerStates.length).fill(false)
        );
        const newCheckboxData = [...checkboxData, ...newCheckboxRows];

        // Update the checkboxData state
        setCheckboxData(newCheckboxData);

        return [...prevData, ...newRows];
      } else if (rowCount < prevData.length) {
        // Remove rows
        setCheckboxData((prevCheckboxData) =>
          prevCheckboxData.slice(0, rowCount)
        );
        return prevData.slice(0, rowCount);
      }
      return prevData;
    });
  };

  const handleSelectChange = (e) => {
    const newNumberOfKeys = parseInt(e.target.value);

    if (newNumberOfKeys > numberOfKeys) {
      setCheckboxData((prevData) => {
        let newData = [...prevData];
        const diff = newNumberOfKeys - numberOfKeys;
        for (let i = 0; i < diff; i++) {
          newData = newData.map((row) => [...row, false]);
        }
        return newData;
      });
    } else {
      setCheckboxData((prevData) => {
        const newData = prevData.map((row) => row.slice(0, newNumberOfKeys));
        return newData;
      });
    }

    setNumberOfKeys(newNumberOfKeys);
  };

  const handleInputChange = (e, rowIndex, key) => {
    const { value } = e.target;
    if (key === "pc") {
      // Ensure that the value is a positive integer
      const intValue = parseInt(value, 10);
      const newValue = isNaN(intValue) || intValue < 0 ? 0 : intValue;
      setTableData((prevData) =>
        prevData.map((row, index) => {
          if (index === rowIndex) {
            return { ...row, [key]: newValue };
          }
          return row;
        })
      );
    } else {
      setTableData((prevData) =>
        prevData.map((row, index) => {
          if (index === rowIndex) {
            return { ...row, [key]: value };
          }
          return row;
        })
      );
    }
  };

  const handleAddPC = (rowIndex) => {
    setTableData((prevData) =>
      prevData.map((row, index) => {
        if (index === rowIndex) {
          return { ...row, pc: row.pc + 1 };
        }
        return row;
      })
    );
  };

  const handleSubtractPC = (rowIndex) => {
    setTableData((prevData) =>
      prevData.map((row, index) => {
        if (index === rowIndex && row.pc > 1) {
          return { ...row, pc: row.pc - 1 };
        }
        return row;
      })
    );
  };

  return (
    <div ref={ref} className="main">
      <div className="flexi">
        <div>
          <table className="custom-table">
            <thead>
              <tr>
                <th className="col-pos">Pozice</th>
                <th className="col-door">Místnost</th>
                <th className="col-cylinder-type">Typ cylindru</th>

                <th className="col-cylinder-length">
                  Délka cylindru v mm <br />
                  <div className="cylinder-type-head">
                    <span>Vnější&nbsp;</span>
                    <img className="" src={cylinderHeadIcon} alt="cylinder" />
                    <span>&nbsp;Vnitřní</span>
                  </div>
                </th>

                <th className="col-pc">Ks</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td id="pos">{rowIndex + 1}</td>
                  <td id="doorDesignation">
                    <input
                      type="text"
                      value={row.doorDesignation}
                      onChange={(e) =>
                        handleInputChange(e, rowIndex, "doorDesignation")
                      }
                    />
                  </td>
                  <td id="cylinderType">
                    <div className="cylinderType-row">
                      <img src={cylinderIcon} alt="cylinder" />
                      <select
                        value={row.cylinderType}
                        onChange={(e) =>
                          handleInputChange(e, rowIndex, "cylinderType")
                        }
                      >
                        {CylinderTypeOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td id="cylinderLength">
                    <input
                      type="text"
                      value={row.cylinderOutsideLength}
                      onChange={(e) =>
                        handleInputChange(e, rowIndex, "cylinderOutsideLength")
                      }
                    />
                    <span>|</span>
                    <input
                      type="text"
                      value={row.cylinderInsideLength}
                      onChange={(e) =>
                        handleInputChange(e, rowIndex, "cylinderInsideLength")
                      }
                    />
                  </td>
                  <td id="pcs">
                    <div className="pcs-row">
                      <img
                        src={icon_minus}
                        alt="remove"
                        onClick={() => handleSubtractPC(rowIndex)}
                      />
                      <input
                        type="text"
                        value={row.pc}
                        onChange={(e) => handleInputChange(e, rowIndex, "pc")}
                        min="0"
                      />
                      <img
                        src={icon_plus}
                        alt="add"
                        onClick={() => handleAddPC(rowIndex)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <button onClick={handleAddRow}>+</button>
            <button onClick={handleRemoveRow}>-</button>
            <select value={selectedRowCount} onChange={handleRowCountChange}>
              {Array.from({ length: 150 }).map((_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <table style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th className="keys-header" colSpan={headerStates.length}>
                  Klíče
                </th>
              </tr>

              <tr>
                {headerStates.map((headerState, index) => (
                  <th key={index}>
                    <div className="keycol">
                      <div>
                        <img src={setting} alt="settings icon" />
                      </div>
                      <div style={{ marginTop: "10px" }}>
                        <img src={iconkey} alt="icon" />
                        <span style={{ fontWeight: "100", marginLeft: "5px" }}>
                          S.{index + 1}
                        </span>
                      </div>
                      <div>
                        {/* "inputField" */}
                        <input
                          type="text"
                          id={`inputField${index}`}
                          name={`inputField${index}`}
                          className="vertical"
                          value={headerState.inputFieldValue || `Klíč ${index}`}
                          onChange={(event) =>
                            handleInput(
                              index,
                              "inputFieldValue",
                              event.target.value
                            )
                          }
                        />
                      </div>
                      <div className="pcs pcs-row">
                        {/* "+" Icon for "myfield" */}
                        <img
                          src={icon_plus}
                          alt="add"
                          onClick={() => handleAdd(index)}
                        />
                        {/* "myfield" */}
                        <input
                          type="number"
                          value={headerState.myFieldValue}
                          min="1"
                          onChange={(event) =>
                            handleInput(
                              index,
                              "myFieldValue",
                              event.target.value
                            )
                          }
                        />
                        {/* "-" Icon for "myfield" */}
                        <img
                          src={icon_minus}
                          alt="remove"
                          onClick={() => handleRemove(index)}
                        />
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {[...Array(tableData.length)].map((_, rowIndex) => (
                <tr className="checkbox" key={rowIndex}>
                  {[...Array(numberOfKeys)].map((_, colIndex) => (
                    <td className="tableborder" key={colIndex}>
                      <div className="dis">
                        <input
                          onChange={() =>
                            handleCheckboxChange(rowIndex, colIndex)
                          }
                          className="inp"
                          type="checkbox"
                        />{" "}
                      </div>{" "}
                    </td>
                  ))}
                  <td>
                    <div
                      className="image-container"
                      onMouseEnter={() => handleMouseEnter(rowIndex)}
                    >
                      <img
                        src={setting}
                        alt="Setting"
                        ref={(el) => (imageRefs.current[rowIndex] = el)} // Set the ref for the image element
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

            {activeImageIndex !== null && (
              <div
                className="dialogue dropdown"
                style={{ ...dialoguePosition }}
                onMouseEnter={() => setIsDropdownOpen(true)} // Set the onMouseEnter event handler on the <div> element
                onMouseLeave={() => handleMouseLeave()}
              >
                <div className="dialogue-option first-option ">
                  <span style={{ marginLeft: "20px" }}>Edit Cylinder</span>{" "}
                  {activeImageIndex}
                </div>
                <div className="dialogue-option">
                  <span style={{ marginLeft: "20px" }}>Close Cylinder</span>{" "}
                  {activeImageIndex}
                </div>
                <div
                  className="dialogue-option"
                  onClick={() => handleInsertBefore(activeImageIndex)}
                >
                  <img src={up} alt="up icon" /> Insert Cylinder Before{" "}
                </div>
                <div
                  className="dialogue-option"
                  onClick={() => handleInsertAfter(activeImageIndex)}
                >
                  <img src={down} alt="down icon" />
                  Insert Cylinder After{" "}
                </div>
                <div
                  className="dialogue-option"
                  onClick={() => handleDelete(activeImageIndex)}
                >
                  <img src={deleted} alt="delete icon" />
                  Delete Cylinder{" "}
                </div>
                <div className="dialogue-option">
                  <img src={reset} alt="reset icon" />
                  reset Cylinder{" "}
                </div>
              </div>
            )}
          </table>
        </div>
        <div>
          <button onClick={handleKeyAdd}>+</button>
          <button onClick={handleKeyMinus}>-</button>
          <select value={numberOfKeys} onChange={(e) => handleSelectChange(e)}>
            {[...Array(150)].map((_, index) => (
              <option key={index} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* onClick={downloadScreenshot} */}
      <button onClick={captureScreenshotAndStore} className="complete-config">
        <Link to="/fourm">Ukončit :)</Link>
      </button>
    </div>
  );
};

export default Config;
