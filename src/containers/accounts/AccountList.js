import { Typography } from "@material-ui/core"


export default function AccountList ({accounts}) {

    return (
        <div style = {{display: "flex", width: "65%", flexDirection: "row", gap: "20px",
            flexWrap: "wrap"
        }}>
            {accounts?.map(account => {
                return <AccountCard account = {account}/>
            })}
        </div>
    )
}

function AccountCard ({account}) {

    const numberFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return (
    <div style = {{ width: '45%', }}>
        <div style = {{display: "flex", flexDirection: "column", gap: "10px",
        width: '100%', background: "white",  borderRadius: "10px 10px 0px 0px", padding: "20px",
        border: "1px solid lighGrey"
        }}>
       <Typography style = {{fontSize: "18px", fontWeight: "bold", color: "black"}}>{account?.accountName}</Typography>
        <Typography style = {{fontSize: "16px", color: "#9B9B9B"}}>{account?.description}</Typography>
        </div>
      <div style = {{background: "white", width: "100%", display: "flex", flexDirection: "row", 
        borderRadius: "0px 0px 10px 10px", padding: "15px", justifyContent: "space-between",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)"
      }}>
      <Typography style = {{ fontSize: "17px"}}>Available</Typography>
      <Typography style = {{fontWeight: "bold", fontSize: "17px"}}>{numberFormatter.format(account?.balance)}</Typography>
      </div>
  
    </div>
    )
}