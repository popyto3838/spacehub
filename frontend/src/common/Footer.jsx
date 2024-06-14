import '/public/css/common/Footer.css';

const Footer = () => {
    return (
        <div className="footer">
            <nav>
                <a href='https://velog.io/@dlehddud60/posts' target='_blank'>Blog</a> |
                <a href='https://github.com/dlehddud60' target='_blank'>Github</a>
            </nav>
            <p>
                <span>팀 : 이동영</span><br/>
                <span>이메일 : dlehddud60@naver.com</span><br/>
                <span>Copyright 2024. cocoder. All Rights Reserved.</span>
            </p>
        </div>
    )
}
export default Footer;