// Search.js
import React from 'react';

const CustomRibbon = ({ query, setQuery }) => {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
                padding: "20px",
                background: "white",
                width: "100%",
                margin: "auto",
                marginTop: "20px",
                borderRadius: "8px 8px 0px 0px",
            }}
        >
            <input
                type="text"
                placeholder="Search"
                style={{
                    width: "400px",
                    height: "40px",
                    padding: "10px",
                    fontSize: "16px",
                    borderRadius: "8px",
                    background: "#EFF0F6",
                    border: "none",
                }}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </div>
    );
};

export default CustomRibbon;
