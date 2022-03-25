import './Icon.scss';

export default function Icon(props) {
  return <span className={ "Icon icon " + props.children + ' ' } />
}
