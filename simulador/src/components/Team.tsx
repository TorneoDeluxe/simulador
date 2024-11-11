interface TeamProps{
    name: string;
    badge: string;
    media: number;
}

function Team(props: TeamProps){
    const {name, badge, media} = props;
    const badgeSize = {
        width: "4vh",
        height: "5vh"
    } 

    return(
        <>
        <img src={badge} style={badgeSize}/>
        <h3>{name}</h3>
        <h5>{media}</h5>

        return <div className="card" style = {{
            color: 'red',
        }}>
        <div className="card-body"></div>
        </div>    
        </>
    )
}