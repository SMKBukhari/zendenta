export const RESETPASSWORD = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <title>Verify Your Email</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: "Helvetica", Helvetica, Arial, sans-serif;
            color: #d6e0ff;
            background-color: #111624;
        }

        .verify-email-nutra,
        .verify-email-nutra * {
            box-sizing: border-box;
        }

        .verify-email-nutra {
            background: #111624;
            border-radius: 10px;
            padding: 0px 0px 72px 0px;
            display: flex;
            flex-direction: column;
            gap: 36px;
            align-items: center;
            justify-content: flex-start;
            position: relative;
            overflow: hidden;
        }

        .email-template-header {
            padding: 40px 48px 40px 48px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
            justify-content: center;
            align-self: stretch;
            flex-shrink: 0;
            position: relative;
        }

        .content-email {
            display: flex;
            flex-direction: column;
            gap: 24px;
            align-items: flex-start;
            justify-content: flex-start;
            flex-shrink: 0;
            width: 649px;
            position: relative;
        }

        .verify-your-email {
            color: #ffffff;
            font-size: 24px;
            font-weight: 700;
        }

        .message {
            color: #d6e0ff;
            font-size: 18px;
            line-height: 150%;
            width: 544px;
        }

        .btn {
            background: #854e9f;
            border-radius: 4px;
            padding: 10px 20px;
            color: #f8f7ff;
            font-size: 16px;
            font-weight: 700;
            text-decoration: none;
            display: inline-block;
        }

        .footer {
            color: #d6e0ff;
            font-size: 18px;
            text-align: center;
            display: flex;
            gap: 8px;
            justify-content: center;
            align-items: center;
        }

        .footer-nutra {
            display: block;
        }

        .divider {
            border-top: 1px solid #232839;
            width: 626px;
            margin: 20px auto;
        }

        .divider-top {
            border-top: 1px solid #232839;
            width: 626px;
            margin: 2px auto;
        }
    </style>
</head>

<body>
    <div class="verify-email-nutra">
        <div class="email-template-header">
            <img src="https://res.cloudinary.com/dcmdhdw6z/image/upload/v1740205895/dtamxplk0n1tkxe8yug8.png" alt="Nutra Logo" width="176" height="35" />
        </div>
        <div class="divider-top"></div>
        <div class="content-email">
            <div class="verify-your-email">Reset Your Password!</div>
            <div class="message">
                Hi {{fullName}},<br /><br />
                We received a request to reset your password. Click the button below to reset it.<br /><br />
                Click the button below to verify your email:
            </div>
            <a class="btn" href="{{resetPasswordLink}}">Reset My Password</a>
            <div class="message">
                For security reasons, this link will expire in 24 hours. If you didn't sign up for Nutra, you can safely ignore this email.<br /><br />
                If you didn't request a password reset, you can safely ignore this email.
                <br />
                Need help? Feel free to reach out to our support team.
            </div>
            <div class="footer-nutra">
                Stay healthy,<br />
                <span class="footer-nutra">The Nutra Team</span>
            </div>
        </div>
        <div class="divider"></div>
        <div class="footer">Powered by <img src="https://res.cloudinary.com/dcmdhdw6z/image/upload/v1740205892/pzgkzscclgjqm1jrebi0.png" alt="Endvor Logo" width="77" height="26" /></div>
    </div>
</body>

</html>
`;
