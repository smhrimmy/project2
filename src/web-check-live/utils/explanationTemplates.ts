export interface Template {
  id: string;
  category: string;
  title: string;
  template: string;
  variables: string[];
}

export const EXPLANATION_TEMPLATES: Template[] = [
  // SSL
  {
    id: 'ssl_expired',
    category: 'SSL',
    title: 'SSL Certificate Expired',
    template: 'I checked your site and found that the SSL certificate for {{domain}} expired on {{expiry_date}}. This is why visitors are seeing a "Not Secure" warning. You can renew this for free in your hosting control panel under the "SSL/TLS" section, or I can help you generate a new AutoSSL certificate now.',
    variables: ['domain', 'expiry_date']
  },
  {
    id: 'ssl_mixed_content',
    category: 'SSL',
    title: 'Mixed Content Warning',
    template: 'Your SSL certificate is valid, but the site isn\'t fully secure because some images or scripts are being loaded over HTTP instead of HTTPS. This causes a "Mixed Content" warning. You can fix this by installing a plugin like "Really Simple SSL" in WordPress, or by updating your site links to use https://.',
    variables: []
  },

  // DNS
  {
    id: 'dns_propagation',
    category: 'DNS',
    title: 'DNS Propagation',
    template: 'I see you recently updated your nameservers for {{domain}}. These changes are still propagating across the internet, which typically takes 24-48 hours. During this time, the site might load for some people but not others. This is normal and will resolve itself automatically once propagation is complete.',
    variables: ['domain']
  },
  {
    id: 'dns_not_pointing',
    category: 'DNS',
    title: 'Domain Not Pointing to IP',
    template: 'It looks like the domain {{domain}} is currently pointing to {{current_ip}}, but your hosting account is on {{server_ip}}. You need to update your A Record in your DNS settings to point to {{server_ip}} for the site to load from our servers.',
    variables: ['domain', 'current_ip', 'server_ip']
  },

  // WordPress
  {
    id: 'wp_db_connection',
    category: 'WordPress',
    title: 'Error Establishing DB Connection',
    template: 'The "Error establishing a database connection" message means your WordPress site can\'t talk to your database. This usually happens if the database credentials in your wp-config.php file don\'t match your actual database user/password. I recommend we check your wp-config.php file and reset your database user password.',
    variables: []
  },
  {
    id: 'wp_white_screen',
    category: 'WordPress',
    title: 'White Screen of Death',
    template: 'The blank white screen you\'re seeing is usually caused by a PHP error or a plugin conflict. To fix this, I suggest we temporarily disable your plugins by renaming the "plugins" folder in File Manager. If the site comes back, we can re-enable them one by one to find the culprit.',
    variables: []
  },
  {
    id: 'wp_update_needed',
    category: 'WordPress',
    title: 'WordPress Update Required',
    template: 'I noticed your site is running WordPress version {{current_version}}, but the latest secure version is {{latest_version}}. Running an outdated version puts your site at risk for security vulnerabilities. I strongly recommend creating a backup and then updating to the latest version as soon as possible.',
    variables: ['current_version', 'latest_version']
  },

  // Email
  {
    id: 'email_bounce',
    category: 'Email',
    title: 'Email Bouncing',
    template: 'If your emails are bouncing with an error, it might be due to your SPF record. I checked and your domain {{domain}} is missing a valid SPF record authorizing our servers to send email for you. We should add a TXT record with "v=spf1 +a +mx include:websitewelcome.com ~all" to fix this.',
    variables: ['domain']
  },
  {
    id: 'email_quota',
    category: 'Email',
    title: 'Mailbox Quota Exceeded',
    template: 'It looks like the email account {{email}} has reached its storage limit. This is why you can\'t receive new messages. You can fix this by deleting old emails via Webmail or by increasing the quota limit in the "Email Accounts" section of cPanel.',
    variables: ['email']
  },

  // Server
  {
    id: 'error_500',
    category: 'Server',
    title: '500 Internal Server Error',
    template: 'A 500 Internal Server Error is a generic message that usually means there\'s a syntax error in your .htaccess file or a PHP error in your code. I recommend checking the "Error Log" in cPanel to see the specific error message, which will tell us exactly which file is causing the problem.',
    variables: []
  },
  {
    id: 'error_403',
    category: 'Server',
    title: '403 Forbidden',
    template: 'A 403 Forbidden error usually means the file permissions are incorrect. Your folders should be set to 755 and files to 644. It could also be a security plugin or .htaccess rule blocking access. Let\'s check your File Manager to ensure permissions are correct.',
    variables: []
  }
];
