#!/usr/bin/env python
# coding: utf-8

# In[1]:


#import dependencies and direct Browser to the chromedriver location
import pandas as pd
import datetime as dt
import os
from bs4 import BeautifulSoup as bs
from splinter import Browser
from selenium import webdriver
from splinter.exceptions import ElementDoesNotExist
import time

def init_browser():
    # @NOTE: Replace the path with your actual path to the chromedriver
    executable_path = {"executable_path":'chromedriver.exe'}
    return Browser("chrome", **executable_path, headless=False)


def scrape_info():
    browser = init_browser()
# In[2]:




    #link to the website that is being scraped
    url = "https://mars.nasa.gov/news/"
    browser.visit(url)


    # In[3]:


    html=browser.html
    soup = bs(html,"html.parser")


    # In[4]:


    ### NASA Mars News


    # In[5]:


    #inspect feature in Chrome was used to identify appropriate class, 'content_title' for news title 
    title=soup.find('div',class_='content_title').text
    print(f'Latest News Title: {title}')


    # In[6]:


    #inspect feature in Chrome was used to identify appropriate classes for the body/paragraph associated with news title
    para=soup.find('div',class_='article_teaser_body').text
    print(f'Latest News Paragraph: {para}')


    # In[7]:


    ### JPL Mars Space Images - Featured Image


    # In[8]:


    #link to the website that is being scraped
    imageurl="https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars"
    browser.visit(imageurl)


    # In[ ]:


    #click on 'FULL IMAGE' link for the featured image
    browser.click_link_by_partial_text('FULL IMAGE')
    time.sleep(2)
    #click on 'more info' for the full sized image
    browser.click_link_by_partial_text('more info')
    time.sleep(2)
    #click on link to the picture ending in ".jpg"
    browser.click_link_by_partial_text('.jpg')


    # In[ ]:


    #print the link to the featured image url
    print(browser.url)


    # In[ ]:


    #assign link to a variable
    featured_image = browser.url


    # In[ ]:


    #link to the Mars Weather website/twitter
    weatherurl="https://twitter.com/marswxreport?lang=en"
    browser.visit(weatherurl)


    # In[ ]:


    wtrsoup=bs(browser.html,'html.parser')
    raw_mars_weather=wtrsoup.find('p',class_="TweetTextSize TweetTextSize--normal js-tweet-text tweet-text")
    print(f"Raw Weather Tweet: {raw_mars_weather.text}\n")
    #Raw Mars weather tweet contains the "pic.twitter.com" link because it pulled extra text embedded in the p tag
    #so, as the next step, only extract the 'zero' index text element
    mars_weather=raw_mars_weather.text
    #assign link to a variable
    latest_weather = mars_weather
    print(f"Clean Weather Tweet: {mars_weather}")


    # In[ ]:


    #Mars Facts
    facturl="https://space-facts.com/mars/"
    #Convert the second (index of 1) html table from the website of interest containing the desired information into a dataframe
    marstable=pd.read_html(facturl)[1]
    #rename column names
    marstable.columns=['Variable','Value']
    marstable.reset_index()
    marstable


    # In[ ]:


    #convert dataframe to "striped" html table without the index
    htmltable=marstable.to_html(classes= 'table table-striped', index=False)
    print(htmltable)


    # In[ ]:


    #Hemis


    # In[ ]:


    hemiurl="https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars"
    browser.visit(hemiurl)
    hemisoup=bs(browser.html,'html.parser')
    #compile all information under the 'div' class 'description' as that is where the relevant information is stored
    results= hemisoup.find_all('div',class_='description')
    #create empty list to hold titles and imgurl
    title_list=[]
    imgurl=[]

    for result in results:
        hemititle = result.find('h3').text.strip()
        title_list.append(hemititle)

    print(title_list)


    # In[ ]:


    for title in title_list:
        browser.click_link_by_partial_text(title)
        time.sleep(2)
        #next, click on original to get the full image
        browser.click_link_by_partial_text('Original')
        time.sleep(1)
        #add to the 'imgurl' list
        imgurl.append(browser.url)
        time.sleep(1)
        #after getting the url to the original image for each hemi
        #go back to the original url with links to all 4 hemis
        browser.visit(hemiurl)


    # In[ ]:


    print(imgurl)


    # In[ ]:


    #iterate through the two lists to create a list of dicitionaries containing title and imgurl
    hemi_image_urls= [ {'Title': title_list[i], 'Image_URL': imgurl[i] } for i in range(len(title_list)) ]
    hemi_image_urls


    # In[ ]:





    # In[ ]:


    #assign hemi_urls list to a variable
    hemilist = hemi_image_urls


    # In[ ]:


    #close the browser
    browser.quit()


    # In[ ]:


    #Store data in a dictionar
    mars_info = {
                    "newest_title": title,
                    "newest_para": para,
                    "featured_image": featured_image,
                    "latest_weather": mars_weather,
                    "factsurl": htmltable,
                    "hemilist": hemi_image_urls
                }
    #print the mars_info dictionary (json object) created with all the scrapped 
    return mars_info


# #convert jupyter notebook file to python file
# !jupyter nbconvert --to script mars_scrape.ipynb

# In[ ]:


# get_ipython().system('jupyter nbconvert --to script mars_scrape.ipynb')


# In[ ]:




