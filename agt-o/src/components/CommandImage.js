import './CommandImage.scss';
import Icon from './Icon.js';

export default function CommandImage(props) {
  const { image, config, request, id } = props;

  function handleChange(e) {
    const file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = () => {
      request({
        action: 'uploadTeamImage',
        data: reader.result,
        id: id,
      });
    };
    reader.readAsDataURL(file);
  }

  return (
    <span className="CommandImage">
      <label htmlFor={ 'image_team_' + id } className="image" style={ { backgroundImage: image ? 'url(' + config.images + image + ')' : '' } }/>
      <input id={ 'image_team_' + id } type="file" onChange={ handleChange } />
      <Icon>brokenimage</Icon>
    </span>
  )
}
