import type {headerButtonInterface} from "../interfaces/headerButtonInterface.ts";

function HeaderButton(props: headerButtonInterface) {
    return (
        <li className="text-lg hover:text-tertiary active:brightness-50 transition-all">
            <a href={props.goto}>{props.text}</a>
        </li>
    )
}

export default HeaderButton;