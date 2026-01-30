import{_ as n,a,o as l,a3 as p}from"./chunks/framework.dRMRuUHH.js";const b=JSON.parse('{"title":"zentao快速部署","description":"","frontmatter":{"id":3002,"title":"zentao快速部署","createTime":"2024-05-17 20:00:00","category":"others"},"headers":[],"relativePath":"docs/others/at22f0f2b3nv.md","filePath":"docs/others/0002_zentao_quickly_deploy.md"}'),e={name:"docs/others/at22f0f2b3nv.md"};function o(r,s,c,t,F,i){return l(),a("div",null,[...s[0]||(s[0]=[p(`<h2 id="zentao快速部署" tabindex="-1">zentao快速部署 <a class="header-anchor" href="#zentao快速部署" aria-label="Permalink to “zentao快速部署”">​</a></h2><div class="language-yaml line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki monokai" style="background-color:#272822;color:#F8F8F2;" tabindex="0" dir="ltr"><code><span class="line"><span style="color:#F92672;">version</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">&#39;3&#39;</span></span>
<span class="line"><span style="color:#F92672;">services</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  zentao-db</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    image</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">mysql:5.7.21</span></span>
<span class="line"><span style="color:#F92672;">    container_name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">zentao-db</span></span>
<span class="line"><span style="color:#F92672;">    ports</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">&#39;3306:3306&#39;</span></span>
<span class="line"><span style="color:#F92672;">    volumes</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">./data/zentao/db:/var/lib/mysql</span></span>
<span class="line"><span style="color:#F92672;">    environment</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">MYSQL_ROOT_PASSWORD=pass4Zentao</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">MYSQL_DATABASE=zentao</span></span>
<span class="line"><span style="color:#F92672;">    networks</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">zentao-net</span></span>
<span class="line"><span style="color:#F92672;">    logging</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">      driver</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">json-file</span></span>
<span class="line"><span style="color:#F92672;">      options</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">        max-size</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">100m</span></span>
<span class="line"><span style="color:#F92672;">        max-file</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">&quot;3&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F92672;">  zentao</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    image</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">hub.zentao.net/app/zentao:20.0</span></span>
<span class="line"><span style="color:#F92672;">    container_name</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">zentao</span></span>
<span class="line"><span style="color:#F92672;">    ports</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">&#39;8000:80&#39;</span></span>
<span class="line"><span style="color:#F92672;">    volumes</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">./data/zentao/file:/data</span></span>
<span class="line"><span style="color:#F92672;">    depends_on</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">zentao-db</span></span>
<span class="line"><span style="color:#F92672;">    environment</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">ZT_MYSQL_HOST=zentao-db</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">ZT_MYSQL_PORT=3306</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">ZT_MYSQL_USER=root</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">ZT_MYSQL_PASSWORD=pass4Zentao</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">ZT_MYSQL_DB=zentao</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">PHP_MAX_EXECUTION_TIME=120</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">PHP_MEMORY_LIMIT=512M</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">PHP_POST_MAX_SIZE=128M</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">PHP_UPLOAD_MAX_FILESIZE=128M</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">LDAP_ENABLED=false</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">SMTP_ENABLED=false</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">APP_DEFAULT_PORT=80</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">APP_DOMAIN=zentao.demo.com</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">PROTOCOL_TYPE=http</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">IS_CONTAINER=true</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">LINK_GIT=false</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">LINK_CI=false</span></span>
<span class="line"><span style="color:#F92672;">    networks</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F8F8F2;">      - </span><span style="color:#E6DB74;">zentao-net</span></span>
<span class="line"><span style="color:#F92672;">    logging</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">      driver</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">json-file</span></span>
<span class="line"><span style="color:#F92672;">      options</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">        max-size</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">100m</span></span>
<span class="line"><span style="color:#F92672;">        max-file</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">&quot;3&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F92672;">networks</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">  zentao-net</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#F92672;">    driver</span><span style="color:#F8F8F2;">: </span><span style="color:#E6DB74;">bridge</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br></div></div>`,2)])])}const m=n(e,[["render",o]]);export{b as __pageData,m as default};
