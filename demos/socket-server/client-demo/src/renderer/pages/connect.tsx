import TextInput from '../components/textinput/TextInput';
import '../styles/pages/connect.scss';

function Connect() {

	return (
		<div className="fit-width center-margin inter connect-page">
			<h2 className="label no-margin" >Connect</h2>
			<div className="flex column">
				<TextInput placeholder="IP Address" />
				<TextInput placeholder="Port" />
			</div>
		</div>
	)
}

export default Connect;
