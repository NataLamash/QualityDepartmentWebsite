using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;

namespace QualityDepartment.Infrastructure.Services
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(
            string recipientEmail,
            string subject,
            string htmlBody)
        {
            var host = GetRequiredSetting("Email:Smtp:Host");
            var fromEmail = GetRequiredSetting("Email:Smtp:FromEmail");

            var username = _configuration["Email:Smtp:Username"];
            var password = _configuration["Email:Smtp:Password"];
            var fromName = _configuration["Email:Smtp:FromName"];

            var port = int.TryParse(
                _configuration["Email:Smtp:Port"],
                out var configuredPort)
                ? configuredPort
                : 587;

            var enableSsl = !bool.TryParse(
                _configuration["Email:Smtp:EnableSsl"],
                out var configuredEnableSsl)
                || configuredEnableSsl;

            using var message = new MailMessage
            {
                From = string.IsNullOrWhiteSpace(fromName)
                    ? new MailAddress(fromEmail)
                    : new MailAddress(fromEmail, fromName),

                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true
            };

            message.To.Add(recipientEmail);

            using var client = new SmtpClient(host, port)
            {
                EnableSsl = enableSsl,
                UseDefaultCredentials = false
            };

            if (!string.IsNullOrWhiteSpace(username))
            {
                if (string.IsNullOrWhiteSpace(password))
                {
                    throw new InvalidOperationException(
                        "SMTP password is not configured.");
                }

                client.Credentials = new NetworkCredential(username, password);
            }

            await client.SendMailAsync(message);
        }

        private string GetRequiredSetting(string key)
        {
            var value = _configuration[key];

            if (string.IsNullOrWhiteSpace(value))
            {
                throw new InvalidOperationException(
                    $"Required configuration setting '{key}' is missing.");
            }

            return value;
        }
    }
}