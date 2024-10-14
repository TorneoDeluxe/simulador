interface TeamProps{
    name: string;
    badge: string;
}

function Team(props: TeamProps){
    const {name, badge} = props;
    const badgeSize = {
        width: "4vh",
        height: "5vh"
    }

    return(
        <>
            <img src={badge}/>
            <h3>{name}</h3>
        </>
    )
}