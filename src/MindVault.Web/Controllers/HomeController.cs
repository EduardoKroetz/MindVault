using Microsoft.AspNetCore.Mvc;

namespace MindVault.Web.Controllers;

[ApiController]
[Route("api")]
public class HomeController : ControllerBase
{

    [HttpHead("status")]
    public IActionResult Status()
    {
        return Ok();
    }
}