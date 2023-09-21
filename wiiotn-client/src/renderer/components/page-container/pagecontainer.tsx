// Purpose: This file contains the PageContainer component which is used to display the page container for the application.
import '../../styles/pagecontainer.scss'
import Footer from '../footer/footer';
import SideMenu from '../sidemenu/sidemenu';

type PageContainerProps = {
	children: React.ReactNode | React.ReactNodeArray | JSX.Element | JSX.ElementArray | [];
}

function PageContainer(props: PageContainerProps) {

	return (

		<div className="page-container full-screen relative flex column">
			<div className="top flex border-box">
				<div className="sidebar">
					<SideMenu />
				</div>
				<div className="content relative overflow-hidden">
					{props.children}
				</div>
			</div>
			<div className="bottom full-width border-box relative">
				<Footer />
			</div>
		</div>
	)
}

export default PageContainer;
