package com.email.writer.app;

import org.springframework.stereotype.Service;

@Service
public class EmailGeneratorService
{
    public String generateEmailReply(EmailRequest emailRequest)
    {
        //Build the Prompt
        String prompt = buildPrompt(emailRequest) ;
        // Craft a Request
        // Do a Request and get response
        // Return Response
    }

    private String buildPrompt(EmailRequest emailRequest)
    {
        StringBuilder prompt = new StringBuilder() ;
        prompt.append("Generate a professional Email reply for the following email content. Please dont generate a subject line. ") ;
        if(emailRequest.getTone()!=null && !emailRequest.getTone().isEmpty())
        {
            prompt.append("Use a ").append(emailRequest.getTone()).append(" Tone") ;
        }
        prompt.append("\n Original Email \n").append(emailRequest.getEmailContent()) ;
        return prompt.toString();
    }
}
