const getEmailTemplate = (title, message, actionUrl = null, actionText = null) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    /* Reset */
    body { margin: 0; padding: 0; background-color: #050511; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e4e4e7; }
    table { border-spacing: 0; width: 100%; }
    td { padding: 0; }
    img { border: 0; }
    a { color: #818cf8; text-decoration: none; }

    /* Theme Variables */
    .bg-main { background-color: #050511; }
    .bg-surface { background-color: #0c5285; }
    .border-color { border: 1px solid #1e293b; }
    
    /* Button */
    .btn-primary {
      display: inline-block;
      background-color: #2f9ceb; 
      color: #ffffff; 
      padding: 14px 32px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: opacity 0.2s;
    }
    .btn-primary:hover { opacity: 0.9; }
  </style>
</head>
<body class="bg-main">
  <table role="presentation" width="100%" class="bg-main">
    <tr>
      <td align="center" style="padding: 40px 0;">
        
        <table role="presentation" width="600" style="max-width: 600px; width: 100%; margin: 0 auto;" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="padding-bottom: 40px;">
              <div style="display: inline-flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px; color: #f8fafc;">☾</span>
                <span style="font-size: 18px; font-weight: 700; color: #f8fafc; letter-spacing: 2px; text-transform: uppercase; margin-left: 8px;">DimLight</span>
              </div>
            </td>
          </tr>

          <tr>
            <td align="center">
              <table role="presentation" width="100%" style="background-color: #0f172a; border: 1px solid #1e293b; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5);">
                <tr>
                  <td style="padding: 48px;">
                    
                    <h1 style="margin: 0 0 24px; font-size: 24px; font-weight: 600; color: #f8fafc; letter-spacing: -0.5px; text-align: center;">
                      ${title}
                    </h1>

                    <div style="height: 1px; width: 40px; background-color: #334155; margin: 0 auto 32px;"></div>

                    <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.8; color: #94a3b8; text-align: center;">
                      ${message.replace(/\n/g, '<br>')}
                    </p>

                    ${actionUrl ? `
                    <div style="text-align: center; margin-top: 10px;">
                      <a href="${actionUrl}" class="btn-primary" target="_blank">${actionText || 'Proceed'}</a>
                    </div>
                    ` : ''}

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-top: 40px;">
              <p style="margin: 0; font-size: 11px; color: #475569; text-transform: uppercase; letter-spacing: 1px;">
                &copy; ${new Date().getFullYear()} DimLight Inc.
              </p>
              <p style="margin-top: 8px; font-size: 12px; color: #334155;">
                Helping you understand your sleep.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

module.exports = getEmailTemplate;